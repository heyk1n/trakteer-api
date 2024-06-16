import { isSuccessfulStatus } from "jsr:@std/http@0.224.4/status";
import {
	type HTTPMethod,
	RouteBases,
	type RouteLike,
	Routes,
} from "../routes.ts";

export class Client {
	#apiKey: string;

	constructor(apiKey: string) {
		this.#apiKey = apiKey;
	}

	async #request<T>(
		route: RouteLike,
		method: HTTPMethod,
		options?: RequestOptions,
	): Promise<T> {
		const url = new URL(RouteBases.api + route);

		if (options?.searchParamsInit) {
			for (const [name, value] of Object.entries(options.searchParamsInit)) {
				url.searchParams.set(name, value);
			}
		}

		const response = await fetch(url, {
			headers: {
				accept: "application/json",
				key: this.#apiKey,
				"x-requested-with": "XMLHttpRequest",
			},
			method,
			body: options?.body,
		});

		const { result, status_code, message } = await response.json();

		if (!isSuccessfulStatus(status_code)) {
			throw new Error(`[TrakteerAPIError]: ${message} (${status_code})`);
		} else {
			return result as T;
		}
	}

	async quantityGiven(email: string): Promise<number> {
		return await this.#request<number>(Routes.quantityGiven(), "POST", {
			body: new URLSearchParams({ email }),
		});
	}

	async supports(options?: SupportHistoryOptions) {
		const searchParamsInit: Record<string, string> = {};

		if (options?.limit) {
			searchParamsInit.limit = String(options.limit);
		}

		if (options?.page) {
			searchParamsInit.page = String(options.page);
		}

		return await this.#request<unknown>(Routes.supports(), "GET", {
			searchParamsInit,
		});
	}
}

export interface RequestOptions {
	body?: BodyInit;
	searchParamsInit?: Record<string, string>;
}

export interface SupportHistoryOptions {
	limit?: number;
	page?: number;
}
