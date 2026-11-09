import { create } from "zustand";
import { getMap } from "./localDb";

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ users: getMap(), loading: false, error: null });
    } catch {
      set({ error: "Failed to load map", loading: false });
    }
  },
}));

export default useUserStore;
