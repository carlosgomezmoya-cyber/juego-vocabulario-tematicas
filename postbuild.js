import fs from 'fs';
import path from 'path';

const distHtmlPath = path.resolve('dist', 'index.html');
if (fs.existsSync(distHtmlPath)) {
  let content = fs.readFileSync(distHtmlPath, 'utf8');

  // Strip type="module", crossorigin, and defer for offline standalone compatibility
  content = content.replace(/<script\s+type="module"\s*crossorigin[^>]*>/gi, '<script>');
  content = content.replace(/<script\s+type="module"[^>]*>/gi, '<script>');
  content = content.replace(/<script\s+defer[^>]*>/gi, '<script>');
  content = content.replace(/crossorigin/gi, '');

  // Extract <script>...</script> block from head if present and move to end of <body>
  const scriptMatch = content.match(/<script[\s\S]*?<\/script>/gi);
  if (scriptMatch) {
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
    const scriptsCombined = scriptMatch.join('\n');
    if (content.includes('</body>')) {
      content = content.replace('</body>', `${scriptsCombined}\n</body>`);
    } else {
      content += scriptsCombined;
    }
  }

  // Write the standalone bundle to dist/INICIAR_JUEGO_TABLET.html and root INICIAR_JUEGO_TABLET.html
  fs.writeFileSync(path.resolve('dist', 'INICIAR_JUEGO_TABLET.html'), content, 'utf8');
  fs.writeFileSync(path.resolve('INICIAR_JUEGO_TABLET.html'), content, 'utf8');
  
  // Also write to dist/index.html so production server can serve it
  fs.writeFileSync(distHtmlPath, content, 'utf8');
  
  console.log('✅ Archivos HTML autónomos generados con éxito en dist/ e INICIAR_JUEGO_TABLET.html.');
  console.log('⚠️  Root index.html conservado limpio para Vite dev server.');
}
