import { spawn } from 'node:child_process';
import type { AIProviderAdapter } from '../types';

type StreamJsonEvent = {
  type?: string;
  subtype?: string;
  result?: string;
  is_error?: boolean;
  session_id?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
};

type RunOptions = {
  binary: string;
  args: string[];
  stdin: string;
  timeoutMs: number;
};

function runCli({ binary, args, stdin, timeoutMs }: RunOptions): Promise<{ result: string; usage?: StreamJsonEvent['usage'] }> {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let stderrBuf = '';
    let resultEvent: StreamJsonEvent | null = null;
    let lastDataAt = Date.now();

    // Idle watchdog: kill if no data for timeoutMs ms
    const watchdog = setInterval(() => {
      if (Date.now() - lastDataAt > timeoutMs) {
        clearInterval(watchdog);
        child.kill('SIGKILL');
        reject(new Error(`Claude Code CLI idle for ${timeoutMs / 1000}s with no output`));
      }
    }, 5_000);

    // Read stream-json events line by line
    let lineBuf = '';
    child.stdout.on('data', (chunk: Buffer) => {
      lastDataAt = Date.now();
      lineBuf += chunk.toString('utf8');
      const lines = lineBuf.split('\n');
      lineBuf = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const event = JSON.parse(trimmed) as StreamJsonEvent;
          if (event.type === 'result') {
            resultEvent = event;
          }
        } catch {
          // non-JSON line — ignore
        }
      }
    });

    child.stderr.on('data', (chunk: Buffer) => { stderrBuf += chunk.toString('utf8'); });

    child.on('error', (err) => {
      clearInterval(watchdog);
      reject(err);
    });

    child.on('close', (code) => {
      clearInterval(watchdog);

      if (resultEvent?.is_error) {
        reject(new Error(`Claude Code CLI error: ${resultEvent.result ?? 'unknown'}`));
        return;
      }

      if (resultEvent?.result != null) {
        resolve({ result: resultEvent.result, usage: resultEvent.usage });
        return;
      }

      reject(new Error(
        `Claude Code CLI exited with code ${code} and no result event. stderr: ${stderrBuf.slice(0, 500)}`,
      ));
    });

    child.stdin.end(stdin);
  });
}

/**
 * Adapter that shells out to the locally-installed `claude` CLI (Claude Code).
 * Uses the user's Max plan subscription — no API key required.
 *
 * Uses --output-format stream-json so output flows as generated (avoids timeout
 * from buffering a full 64K-token response). --bare skips CLI startup overhead
 * (CLAUDE.md discovery, plugins, LSP, auto-memory). --tools "" disables tool
 * use — the converter only needs pure text generation.
 *
 * Will NOT work on Vercel serverless (no persistent binary, no auth).
 */
export function createClaudeCodeAdapter(binary = 'claude'): AIProviderAdapter {
  return {
    async complete(options) {
      const systemMessages = options.messages
        .filter((m) => m.role === 'system')
        .map((m) => m.content)
        .join('\n\n');

      const conversation = options.messages
        .filter((m) => m.role !== 'system')
        .map((m) => (m.role === 'assistant' ? `Assistant: ${m.content}` : m.content))
        .join('\n\n');

      const args = [
        '-p',
        '--output-format', 'stream-json',
        '--include-partial-messages',
        '--verbose',
        '--no-session-persistence',
        '--model', options.model,
      ];

      if (systemMessages) {
        args.push('--system-prompt', systemMessages);
      }

      // Idle timeout: kill if no output for 5 minutes (not a hard wall-clock limit)
      const { result, usage } = await runCli({
        binary,
        args,
        stdin: conversation,
        timeoutMs: 300_000,
      });

      return {
        content: result,
        inputTokens: usage?.input_tokens,
        outputTokens: usage?.output_tokens,
      };
    },
  };
}
