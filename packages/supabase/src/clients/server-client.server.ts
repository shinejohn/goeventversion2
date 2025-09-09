import {
  CookieMethodsServer,
  CookieOptions,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';

import { Database } from '../database.types';
import { getSupabaseClientKeys } from '../get-supabase-client-keys';

const keys = getSupabaseClientKeys();
console.log('=== SERVER CLIENT INIT ===');
console.log('Supabase URL being used:', keys.url);
console.log('Has public key:', !!keys.publicKey);
console.log('=== END SERVER CLIENT INIT ===');

/**
 * @name getSupabaseServerClient
 * @description Get a Supabase client for use in server-side functions.
 */
export function getSupabaseServerClient<GenericSchema = Database>(
  request: Request,
) {
  const headers = request.headers || new Headers();

  const cookies = parseCookieHeader(request.headers.get('Cookie') ?? '').reduce<
    Record<string, string>
  >((acc, { name, value }) => {
    acc[name] = value as string;
    return acc;
  }, {});

  const cookiesAdapter: CookieMethodsServer = {
    getAll() {
      return Object.entries(cookies).map(([name, value]) => ({ name, value }));
    },
    setAll(
      newCookies: Array<{
        name: string;
        value: string;
        options: CookieOptions;
      }>,
    ) {
      newCookies.forEach(({ name, value, options }) => {
        headers.append(
          'Set-Cookie',
          serializeCookieHeader(name, value, options),
        );
      });
    },
  };

  return createServerClient<GenericSchema>(keys.url, keys.publicKey, {
    cookies: cookiesAdapter,
  });
}
