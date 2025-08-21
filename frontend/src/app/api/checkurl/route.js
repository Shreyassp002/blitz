// src/app/api/checkurl/route.js
export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ embeddable: false, error: "No URL provided" });
    }

    // Validate URL format
    let validUrl;
    try {
      validUrl = new URL(url);
    } catch {
      return Response.json({ embeddable: false, error: "Invalid URL format" });
    }

    // Only allow http/https
    if (!["http:", "https:"].includes(validUrl.protocol)) {
      return Response.json({
        embeddable: false,
        error: "Only HTTP/HTTPS URLs allowed",
      });
    }

    // Try to fetch the URL and check headers
    try {
      const response = await fetch(url, {
        method: "HEAD", // Just get headers, not content
        headers: {
          "User-Agent": "Blitz-Auction-Bot/1.0",
        },
        // Add timeout and other options
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      // Check X-Frame-Options header
      const xFrameOptions = response.headers.get("x-frame-options");
      if (xFrameOptions) {
        const xFrameValue = xFrameOptions.toLowerCase();
        if (xFrameValue === "deny" || xFrameValue === "sameorigin") {
          return Response.json({
            embeddable: false,
            reason: `X-Frame-Options: ${xFrameOptions}`,
          });
        }
      }

      // Check Content-Security-Policy header
      const csp = response.headers.get("content-security-policy");
      if (csp && csp.toLowerCase().includes("frame-ancestors")) {
        // Simple check - if frame-ancestors exists and doesn't include '*'
        if (
          !csp.toLowerCase().includes("frame-ancestors *") &&
          !csp.toLowerCase().includes("frame-ancestors 'self' *")
        ) {
          return Response.json({
            embeddable: false,
            reason: "CSP frame-ancestors restriction",
          });
        }
      }

      // If we get here, it's likely embeddable
      return Response.json({
        embeddable: true,
        status: response.status,
        statusText: response.statusText,
      });
    } catch (fetchError) {
      // Network error, timeout, or other fetch issues
      return Response.json({
        embeddable: false,
        error: "Unable to check URL",
        details: fetchError.message,
      });
    }
  } catch (error) {
    console.error("CheckURL API Error:", error);
    return Response.json(
      {
        embeddable: false,
        error: "Server error",
      },
      { status: 500 }
    );
  }
}
