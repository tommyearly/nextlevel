/** Base path for Martin Kelly Costa del Sol client site when served under nextlevelweb.ie */
export const MARTIN_KELLY_BASE = '/martin-kelly-costa-del-sol';

export function mkPath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${MARTIN_KELLY_BASE}${p}`;
}
