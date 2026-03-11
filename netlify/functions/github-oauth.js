// GitHub OAuth callback handler for Netlify Functions
// Exchanges the authorization code for an access token
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { code } = JSON.parse(event.body || '{}');

  if (!code) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing authorization code' }) };
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'OAuth not configured' }) };
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      })
    });

    const data = await response.json();

    if (data.error) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: data.error_description || data.error }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ access_token: data.access_token, token_type: data.token_type, scope: data.scope })
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to exchange token' }) };
  }
};
