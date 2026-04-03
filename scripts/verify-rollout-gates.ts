import { spawnSync } from 'node:child_process';

type GateStep = {
  name: string;
  command: string;
  args: string[];
  note?: string;
};

const stage = process.argv[2] || 'local';

function runStep(step: GateStep): void {
  console.log(`[gate] START ${step.name}`);
  if (step.note) {
    console.log(`[gate] NOTE ${step.note}`);
  }

  const result = spawnSync(step.command, step.args, {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0) {
    console.error(`[gate] FAIL ${step.name}`);
    process.exit(result.status ?? 1);
  }

  console.log(`[gate] PASS ${step.name}`);
}

function getSteps(targetStage: string): GateStep[] {
  const local: GateStep[] = [
    { name: 'migrate schema', command: 'npm', args: ['run', 'db:migrate'] },
    { name: 'verify schema', command: 'npm', args: ['run', 'db:verify'] },
    { name: 'seed baseline cms', command: 'npm', args: ['run', 'seed:cms-baseline'] },
    { name: 'production build', command: 'npm', args: ['run', 'build'] },
  ];

  const runtime: GateStep[] = [
    {
      name: 'admin health',
      command: 'npm',
      args: ['run', 'health:admin'],
      note: 'Requires app server running (default: http://localhost:3000).',
    },
    {
      name: 'runtime smoke',
      command: 'npm',
      args: ['run', 'smoke'],
      note: 'Requires app server running (default: http://localhost:3000).',
    },
  ];

  if (targetStage === 'local') {
    return local;
  }

  if (targetStage === 'runtime') {
    return runtime;
  }

  if (targetStage === 'full') {
    return [...local, ...runtime];
  }

  throw new Error(`Unsupported stage "${targetStage}". Use: local | runtime | full`);
}

async function main(): Promise<void> {
  const steps = getSteps(stage);
  for (const step of steps) {
    runStep(step);
  }

  console.log(`[gate] COMPLETE stage=${stage} steps=${steps.length}`);
}

main().catch((error) => {
  console.error('[gate] failed', error);
  process.exit(1);
});
