export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ embeddable: false, error: "No URL provided" });
    }

    let validUrl;
    try {
      validUrl = new URL(url);
    } catch {
      return Response.json({ embeddable: false, error: "Invalid URL format" });
    }

    if (!["http:", "https:"].includes(validUrl.protocol)) {
      return Response.json({
        embeddable: false,
        error: "Only HTTP/HTTPS URLs allowed",
      });
    }

    try {
      const response = await fetch(url, {
        method: "HEAD",
        headers: {
          "User-Agent": "Blitz-Auction-Bot/1.0",
        },
        signal: AbortSignal.timeout(5000),
      });

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

      const csp = response.headers.get("content-security-policy");
      if (csp && csp.toLowerCase().includes("frame-ancestors")) {
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

      return Response.json({
        embeddable: true,
        status: response.status,
        statusText: response.statusText,
      });
    } catch (fetchError) {
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
