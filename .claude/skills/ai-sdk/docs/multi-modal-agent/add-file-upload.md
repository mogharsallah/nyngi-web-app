## Add File Upload

To make your agent multi-modal, let's add the ability to upload and send both images and PDFs to the model. In v5, files are sent as part of the message's `parts` array. Files are converted to data URLs using the FileReader API before being sent to the server.

Update your root page (`app/page.tsx`) with the following code:

```tsx filename="app/page.tsx" highlight="4-5,10-12,15-39,46-81,87-97"
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRef, useState } from 'react';
import Image from 'next/image';

async function convertFilesToDataURLs(files: FileList) {
  return Promise.all(
    Array.from(files).map(
      file =>
        new Promise<{
          type: 'file';
          mediaType: string;
          url: string;
        }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              type: 'file',
              mediaType: file.type,
              url: reader.result as string,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
    ),
  );
}

export default function Chat() {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts.map((part, index) => {
            if (part.type === 'text') {
              return <span key={`${m.id}-text-${index}`}>{part.text}</span>;
            }
            if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
              return (
                <Image
                  key={`${m.id}-image-${index}`}
                  src={part.url}
                  width={500}
                  height={500}
                  alt={`attachment-${index}`}
                />
              );
            }
            if (part.type === 'file' && part.mediaType === 'application/pdf') {
              return (
                <iframe
                  key={`${m.id}-pdf-${index}`}
                  src={part.url}
                  width={500}
                  height={600}
                  title={`pdf-${index}`}
                />
              );
            }
            return null;
          })}
        </div>
      ))}

      <form
        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
        onSubmit={async event => {
          event.preventDefault();

          const fileParts =
            files && files.length > 0
              ? await convertFilesToDataURLs(files)
              : [];

          sendMessage({
            role: 'user',
            parts: [{ type: 'text', text: input }, ...fileParts],
          });

          setInput('');
          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          className=""
          onChange={event => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
```

In this code, you:

1. Add a helper function `convertFilesToDataURLs` to convert file uploads to data URLs.
1. Create state to hold the input text, files, and a ref to the file input field.
1. Configure `useChat` with `DefaultChatTransport` to specify the API endpoint.
1. Display messages using the `parts` array structure, rendering text, images, and PDFs appropriately.
1. Update the `onSubmit` function to send messages with the `sendMessage` function, including both text and file parts.
1. Add a file input field to the form, including an `onChange` handler to handle updating the files state.

