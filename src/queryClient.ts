import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// type MapperFunction<Input, Output> = (input: Input) => Output;

// type QueryParams<T extends keyof OBSRequestTypes, O> = {
//   type: T;
//   mapper?: MapperFunction<OBSResponseTypes[T], O>;
//   options?: {
//     enabled?: boolean;
//     staleTime?: number;
//     cacheTime?: number;
//   };
// };

// type CheckUnknown<T, True, False> = unknown extends T ? True : False;

// type QueryResponse<
//   T extends keyof OBSRequestTypes,
//   O,
//   R extends OBSResponseTypes[T],
//   P extends QueryParams<T, O>,
// > =
//   P extends QueryParams<T, infer U>
//     ? U extends undefined
//       ? R
//       : CheckUnknown<U, R, U>
//     : never;

// export function createQuery<
//   T extends keyof OBSRequestTypes,
//   R extends OBSResponseTypes[T],
//   O,
//   QR extends QueryResponse<T, O, R, QueryParams<T, O>>,
//   UQR extends UseQueryResult<QR>,
// >({ type, mapper, options }: QueryParams<T, O>) {
//   return function useObsQuery(innerOptions?: QueryParams<T, O>["options"]) {
//     const context = OBSProvider.useContext();
//     return useQuery(
//       ["obs", type],
//       async () => {
//         return await context.call(type).then((data) => {
//           if (mapper) {
//             return mapper(data as R) as unknown as QR;
//           }
//           return data as QR;
//         });
//       },
//       {
//         ...(options ?? {}),
//         ...(innerOptions ?? {}),
//       },
//     ) as UQR;
//   };
// }

// export function createQueryWithParams<
//   T extends keyof OBSRequestTypes,
//   R extends OBSResponseTypes[T],
//   D extends OBSRequestTypes[T],
//   O,
//   QR extends QueryResponse<T, O, R, QueryParams<T, O>>,
//   UQR extends UseQueryResult<QR>,
// >({ type, mapper, options }: QueryParams<T, O>) {
//   return function useObsQuery(
//     data: D,
//     innerOptions?: QueryParams<T, O>["options"],
//   ) {
//     const context = OBSProvider.useContext();
//     return useQuery(
//       ["obs", type, data],
//       async () => {
//         return await context.call(type, data).then((data) => {
//           if (mapper) {
//             return mapper(data as R) as unknown as QR;
//           }
//           return data as QR;
//         });
//       },
//       {
//         ...(options ?? {}),
//         ...(innerOptions ?? {}),
//       },
//     ) as UQR;
//   };
// }

// export function createInvalidateQuery<T extends keyof OBSRequestTypes>(
//   type: T,
// ) {
//   return function useObsQuery() {
//     const queryClient = useQueryClient();
//     return React.useCallback(async () => {
//       await queryClient.invalidateQueries(["obs", type]);
//     }, [queryClient]);
//   };
// }

// export function createInvalidateQueryWithParams<
//   T extends keyof OBSRequestTypes,
//   D extends OBSRequestTypes[T],
// >(type: T) {
//   return function useObsQuery() {
//     const queryClient = useQueryClient();
//     return React.useCallback(
//       async (params: D) => {
//         await queryClient.invalidateQueries(["obs", type, params]);
//       },
//       [queryClient],
//     );
//   };
// }

// export function createSetQueryData<
//   T extends keyof OBSRequestTypes,
//   R extends OBSResponseTypes[T],
// >(type: T) {
//   return function useObsQuery() {
//     const queryClient = useQueryClient();
//     return React.useCallback(
//       (data: R) => {
//         return queryClient.setQueryData(["obs", type], data);
//       },
//       [queryClient],
//     );
//   };
// }

// export function createSetQueryWithParamsData<
//   T extends keyof OBSRequestTypes,
//   D extends OBSRequestTypes[T],
//   R extends OBSResponseTypes[T],
// >(type: T) {
//   return function useObsQuery() {
//     const queryClient = useQueryClient();
//     return React.useCallback(
//       async (params: D, data: R) => {
//         return queryClient.setQueryData(["obs", type, params], data);
//       },
//       [queryClient],
//     );
//   };
// }

// export function createMutation<
//   T extends keyof OBSRequestTypes,
//   R extends OBSResponseTypes[T],
//   D extends OBSRequestTypes[T],
//   O,
//   QR extends QueryResponse<T, O, R, QueryParams<T, O>>,
//   UMR extends UseMutationResult<QR, unknown, D, unknown>,
// >({ type, mapper }: QueryParams<T, O>): () => UMR {
//   return function useObsMutation(options?: {
//     onSuccess?: (data: QR) => void;
//     onError?: (error: unknown) => void;
//   }) {
//     const context = OBSProvider.useContext();
//     return useMutation(async (data: D) => {
//       return await context.call(type, data).then((data) => {
//         if (mapper) {
//           return mapper(data as R) as unknown as QR;
//         }
//         return data as QR;
//       });
//     }, options) as UMR;
//   };
// }

// export function createMutationWithoutParams<
//   T extends keyof OBSRequestTypes,
//   R extends OBSResponseTypes[T],
//   // D extends OBSRequestTypes[T],
//   O,
//   QR extends QueryResponse<T, O, R, QueryParams<T, O>>,
//   UMR extends UseMutationResult<QR, unknown, void, unknown>,
// >({ type, mapper }: QueryParams<T, O>): () => UMR {
//   return function useObsMutation(options?: {
//     onSuccess?: (data: QR) => void;
//     onError?: (error: unknown) => void;
//   }) {
//     const context = OBSProvider.useContext();
//     return useMutation(async () => {
//       return await context.call(type).then((data) => {
//         if (mapper) {
//           return mapper(data as R) as unknown as QR;
//         }
//         return data as QR;
//       });
//     }, options) as UMR;
//   };
// }
