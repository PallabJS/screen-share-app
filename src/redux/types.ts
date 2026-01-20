export type ActionState<Data = unknown> = {
  loading: boolean;
  fetching: boolean;
  error?: string;
  data?: Data;
};
