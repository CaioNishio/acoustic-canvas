import { readFile, writeFile } from 'node:fs/promises';
const origin = process.argv[2];
if (!origin || !/^https?:\/\//.test(origin)) throw new Error('Usage: node scripts/seo-http-audit.mjs https://deploy-host');
const manifest = JSON.parse(await readFile('dist/seo-manifest.json','utf8'));
const checks = [...manifest.map(r=>({path:r.route,status:200,title:r.title})),{path:'/pagina-inexistente-seo-audit',status:404},{path:'/produtos/produto-inexistente-audit',status:404},{path:'/loja',status:301},{path:'/envio-fotos/teste-audit',status:200},{path:'/loja/teste-audit',status:200},{path:'/produtos/shopify/teste-audit',status:200},{path:'/robots.txt',status:200},{path:'/sitemap.xml',status:200}];
const results=[];
let cursor=0;
async function worker(){
  while(cursor<checks.length){
    const check=checks[cursor++];
    try {
      let response=await fetch(new URL(check.path,origin),{redirect:'manual',signal:AbortSignal.timeout(30000)});
      const normalization = response.status === 301 && response.headers.get('location') === `${check.path}/` && check.status === 200;
      if (normalization) response = await fetch(new URL(`${check.path}/`,origin),{redirect:'manual',signal:AbortSignal.timeout(30000)});
      const html=await response.text();
      const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
      const canonical=html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)?.[1];
      const expectedCanonical=`https://sonaracusticos.com${check.path === '/' ? '/' : `${check.path}/`}`;
      const ok=response.status===check.status && (!check.title || (title===check.title.replaceAll('&','&amp;').replaceAll('"','&quot;') && canonical===expectedCanonical));
      results.push({...check,actual:response.status,title,canonical,normalization,location:response.headers.get('location'),ok});
    } catch(error){results.push({...check,ok:false,error:String(error)});}
  }
}
await Promise.all(Array.from({length:4},worker));
const label = new URL(origin).hostname.replace(/[^a-z0-9.-]/gi, '_');
await writeFile(`seo-intelligence/01_TECHNICAL/http-audit-${label}.json`,JSON.stringify({origin,date:new Date().toISOString(),results},null,2));
const failures=results.filter(r=>!r.ok);
console.log(JSON.stringify({origin,total:results.length,passed:results.length-failures.length,failures},null,2));
if(failures.length)process.exitCode=1;
