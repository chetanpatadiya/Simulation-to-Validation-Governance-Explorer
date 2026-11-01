import {cp,mkdir,rm,readFile} from 'node:fs/promises';
import {join} from 'node:path';
const root=process.cwd(),dist=join(root,'dist');
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
for(const name of ['index.html','sw.js','manifest.webmanifest'])await cp(join(root,name),join(dist,name));
for(const name of ['src','assets','public'])await cp(join(root,name),join(dist,name),{recursive:true});
const html=await readFile(join(dist,'index.html'),'utf8');
for(const ref of ['./assets/styles.css','./src/app.js','./public/icon.svg'])if(!html.includes(ref))throw new Error(`Missing app resource: ${ref}`);
console.log('Built dependency-free static site in dist/. Ready for GitHub Pages.');
