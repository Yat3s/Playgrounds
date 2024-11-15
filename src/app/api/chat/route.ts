// Set the runtime to edge for best performance
export const runtime = 'edge';
const StreamChatAPI = 'https://api.x-model.ai/v1/predict';

export async function POST(req: Request) {
    const body = await req.json();

    // TODO, replace with user API key
    const apiKey = 'xm.pEOJWzFLjAYVQUui88VIYOHZ7qy8BSgx'

    // Initialize a fetch request with streaming support by passing in the 'body' as JSON.
    const fetchResponse = await fetch(StreamChatAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            stream: true,
            ...body,
        }),
    });

    if (fetchResponse.ok && fetchResponse.body) {
        return new Response(CustomOpenAIStream(fetchResponse.body));
    } else {
        console.error(`Fetch error: ${fetchResponse.statusText}`);
        return new Response(`Fetch error: ${fetchResponse.statusText}`, {
            status: fetchResponse.status,
            statusText: fetchResponse.statusText,
        });
    }
}

const CustomOpenAIStream = (stream: ReadableStream) => {
    let unfinishedLine = '';
    const contentStream = stream.pipeThrough(new TransformStream({
        transform(chunk, controller) {
            try {
                // Convert the Uint8Array chunk to a string.
                let textChunk = new TextDecoder().decode(chunk, { stream: true });

                // Add any partial data from the last chunk to the start of this one.
                textChunk = unfinishedLine + textChunk;
                unfinishedLine = ''; // Reset the unfinishedLine for the new data.

                const lines = textChunk.split('\n');

                lines.forEach((line, index) => {
                    try {
                        if (line.startsWith('data: ')) {
                            const json = JSON.parse(line.slice('data: '.length));
                            // Check if the 'json' has the 'choices' property with the expected structure.
                            if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content) {
                                controller.enqueue(json.choices[0].delta.content);
                            }
                        }
                    } catch (e) {
                        if (index === lines.length - 1) { // If it's the last line, it might be incomplete
                            unfinishedLine = line; // Store the partial data for the next chunk.
                        }
                    }
                });
            } catch (error) {
                // If there is an error, terminate the stream.
                console.error('Stream transformation error:', error);
                controller.error(error);
            }
        },
        flush(controller) {
            // Try to process any remaining partial data when the stream ends.
            if (unfinishedLine) {
                try {
                    const json = JSON.parse(unfinishedLine.slice('data: '.length));
                    if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content) {
                        controller.enqueue(json.choices[0].delta.content);
                    }
                } catch (error) {
                    console.error('Error parsing final partial line as JSON:', error);
                }
            }
        }
    }));
    return contentStream;
}
