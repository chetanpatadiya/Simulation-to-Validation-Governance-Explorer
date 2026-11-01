import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';
const root=resolve(process.cwd(),process.argv[2]||'.');
const types={'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.json':'application/json'};
const port=Number(process.env.PORT||4173);
http.createServer(async (req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=resolve(root,'.'+pathname,(pathname.endsWith('/')?'index.html':''));
    if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end('Forbidden');return;}
    if(!(await stat(file)).isFile())throw new Error('Not a file');
    const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(body);
  } catch {res.writeHead(404).end('Not Found');}
}).listen(port,()=>console.log(`SVG Explorer → http://localhost:${port}`));
