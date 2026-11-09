import { create } from "zustand";
import useUserStore from "./dataStore";
import { bulkAddAccounts } from "./localDb";

const updateDataStore = create((set) => ({
  loading: false,
  error: null,

  uploadBulkAccounts: async (accounts) => {
    set({ loading: true, error: null });
    try {
      const result = bulkAddAccounts(accounts);
      await useUserStore.getState().fetchUsers();
      set({ loading: false });
      return result;
    } catch (err) {
      set({ error: err.message || "Failed to upload accounts", loading: false });
      throw err;
    }
  },
}));

export default updateDataStore;
