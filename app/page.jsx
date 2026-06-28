/**
 * Server Component — reads index.html at build/request time, extracts the body
 * content, and passes it to the Client Component (PawTrackApp) for rendering.
 *
 * This keeps 100% of the original HTML intact without any JSX conversion risk.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import PawTrackApp from '../components/PawTrackApp';

export default function Page() {
  // Read the original index.html from the project root
  const indexPath = join(process.cwd(), 'index.html');
  const rawHtml = readFileSync(indexPath, 'utf-8');

  // Extract everything between <body> and </body>
  const bodyStart = rawHtml.indexOf('<body>') + '<body>'.length;
  const bodyEnd = rawHtml.lastIndexOf('</body>');
  let bodyContent = rawHtml.substring(bodyStart, bodyEnd);

  // Remove the <script> tag (app.js is loaded via dynamic import in useEffect)
  bodyContent = bodyContent.replace(
    /<script[^>]+src=["'][^"']*app\.js[^"']*["'][^>]*><\/script>/gi,
    ''
  );

  return <PawTrackApp htmlContent={bodyContent} />;
}
