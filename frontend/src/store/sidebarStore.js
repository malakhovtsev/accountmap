import { create } from "zustand";
import useUserStore from "./dataStore";
import * as db from "./localDb";

const useSidebarStore = create((set) => {
	// Runs a local DB operation with the same loading/error/success flags the UI already uses.
	const run = async (fallbackError, operation) => {
		set({ loading: true, error: null, success: false });
		try {
			const data = operation();
			await useUserStore.getState().fetchUsers();
			set({ loading: false, success: true });
			return data;
		} catch (err) {
			set({ error: err.message || fallbackError, loading: false });
			throw err;
		}
	};

	return {
		loading: false,
		error: null,
		success: false,

		createAccount: ({ name, username, notes }) =>
			run("Failed to create account", () => db.addAccount({ name, username, notes })),

		createConnection: (connectionData) =>
			run("Failed to create connection", () => db.addIdentity(connectionData)),

		linkConnection: ({ accountId, identityId }) =>
			run("Failed to link connection", () => db.linkAccount({ accountId, identityId })),

		deleteAccount: (accountId) =>
			run("Failed to delete account", () => db.deleteAccount(accountId)),

		deleteIdentity: (identityId) =>
			run("Failed to delete identity", () => db.deleteIdentity(identityId)),

		resetState: () => set({ loading: false, error: null, success: false }),
	};
});

export default useSidebarStore;
