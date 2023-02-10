import { PadCatalogue } from "../data/pad/pad.catalogue";
import { PadCatalogueDetail } from "../data/pad/pad.catalogue.detail";
import { apiSlice } from "./apiSlice";

export const padService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPadCatalogs: builder.mutation<PadCatalogueDetail[], any>({
            query: (_) => ({
                url: '/pad/catalogs',
                method: "GET",
            }),
            transformResponse: (response: { data: PadCatalogueDetail[] }, _, __) => response.data,
        }),
        getPadCatalogDetail: builder.mutation<PadCatalogueDetail, any>({
            query: (data) => ({
                url: '/pad/catalogue/detail',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: PadCatalogueDetail }, _, __) => response.data,
        }),
        registerPadCatalogue: builder.mutation<PadCatalogueDetail, any>({
            query: (data) => ({
                url: '/pad/register/catalogue',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: PadCatalogueDetail }, _, __) => response.data,
        }),
        updatePadCatalogue: builder.mutation<PadCatalogueDetail, any>({
            query: (data) => ({
                url: '/pad/update/catalogue',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: PadCatalogueDetail }, _, __) => response.data,
        }),
        registerPadCatalogueComponent: builder.mutation<PadCatalogueDetail, any>({
            query: (data) => ({
                url: '/pad/register/catalogue/component',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: PadCatalogueDetail }, _, __) => response.data,
        }),
        deletePadCatalogueComponent: builder.mutation<PadCatalogueDetail, any>({
            query: (data) => ({
                url: '/pad/catalogue/delete',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: PadCatalogueDetail }, _, __) => response.data,
        }),
    }),
});

export const {
    useGetPadCatalogsMutation,
    useRegisterPadCatalogueMutation,
    useRegisterPadCatalogueComponentMutation,
    useDeletePadCatalogueComponentMutation,
    useGetPadCatalogDetailMutation,
    useUpdatePadCatalogueMutation
} = padService;