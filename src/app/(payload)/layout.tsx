import '@payloadcms/next/css';
import config from '@payload-config';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import { importMap } from './admin/importMap';
import type { ServerFunctionClient } from 'payload';
import { getPayload } from 'payload';

export const dynamic = 'force-dynamic';

type PayloadRootLayoutProps = {
  children: React.ReactNode;
};

export default async function PayloadRootLayout({ children }: PayloadRootLayoutProps) {
  await getPayload({ config });

  const serverFunction: ServerFunctionClient = async (args) => {
    'use server';

    await getPayload({ config });
    return handleServerFunctions({
      ...args,
      config,
      importMap,
    });
  };

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
