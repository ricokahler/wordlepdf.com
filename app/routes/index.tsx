import { LoaderFunction } from 'remix';
import { renderToStream } from '@react-pdf/renderer';
import { parseState } from '../parse-state';
import { WordleDocument } from '../wordle-document';

function streamToBuffer(stream: NodeJS.ReadableStream) {
  return new Promise<Buffer>((resolve, reject) => {
    const buffers: Uint8Array[] = [];
    stream.on('error', reject);
    stream.on('data', (data) => buffers.push(data));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const pdf = await renderToStream(
    <WordleDocument {...parseState(url.searchParams)} />,
  );

  const buffer = await streamToBuffer(pdf);

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
    },
  });
};
