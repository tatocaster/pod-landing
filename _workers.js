export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/rss_feed.xml') {
      const object = await env.PODCAST_BUCKET.get('rss_feed.xml');
      if (object === null) {
        return new Response('Object Not Found', { status: 404 });
      }
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('content-type', 'application/xml; charset=utf-8');
      return new Response(object.body, {
        headers,
      });
    }

    return env.next();
  },
};
