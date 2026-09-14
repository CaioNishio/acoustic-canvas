// Test upstream for Netlify Dev: static files only, deliberately no SPA fallback.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
createServer(async (req,res)=>{
  try {
    let target = path.resolve(root, '.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(target!==root && !target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    if((await stat(target)).isDirectory())target=path.join(target,'index.html');
    const data=await readFile(target);
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'}).end(data);
  }catch{res.writeHead(404).end('Not found');}
}).listen(4176,'127.0.0.1',()=>console.log('Static-only upstream http://127.0.0.1:4176'));
