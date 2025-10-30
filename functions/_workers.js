export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const isR2Path =
      pathname === '/rss_feed.xml' ||
      pathname.startsWith('/audio/') ||
      pathname.endsWith('.jpg');

    if (isR2Path) {
      // Get the object key from the path by removing the leading slash.
      const key = pathname.substring(1);

      const object = await env.PODCAST_BUCKET.get(key);

      if (object === null) {
        return new Response('Object Not Found', { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);

      if (pathname === '/rss_feed.xml') {
        headers.set('content-type', 'application/xml; charset=utf-8');
      }
      
      return new Response(object.body, {
        headers,
      });
    }
    return env.next();
  },
};
