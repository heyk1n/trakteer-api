export async function parseRequest(request: Request, webhookToken?: string) {
	if (webhookToken) {
		const token = request.headers.get("x-webhook-token");

		if (webhookToken !== token) {
			throw new Error("Invalid webhook token");
		}
	}

	return await request.json();
}
