export const RouteBases = {
	api: "https://api.trakteer.id/v1/public",
};

export const Routes = {
	quantityGiven() {
		return `/quantity-given` as const;
	},
	supports() {
		return `/supports` as const;
	},
	currentBalance() {
		return `/current-balance` as const;
	},
	transactions() {
		return `/transactions` as const;
	},
};

export type RouteLike = `/${string}`;

export type HTTPMethod = "GET" | "POST";
