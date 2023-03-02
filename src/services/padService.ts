import { PadCatalogue } from "../data/pad/pad.catalogue";
import { PadCatalogueDetail } from "../data/pad/pad.catalogue.detail";
import { PadComponentUsed } from "../data/pad/pad.component.used";
import { PadDetail } from "../data/pad/pad.detail";
import { Service } from "../data/service/service";
import { ServiceCategory } from "../data/service/service.category";
import { apiSlice } from "./apiSlice";

export const padService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPads: builder.mutation<PadDetail[], any>({
            query: (_) => ({
                url: '/pad',
                method: "GET",
            }),
            transformResponse: (response: { data: PadDetail[] }, _, __) => response.data,
        }),
        getPadServices: builder.mutation<any, any>({
            query: (data) => ({
                url: '/pad/patient',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: any }, _, __) => response.data,
        }),
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
        registerPad: builder.mutation<any, any>({
            query: (data) => ({
                url: '/pad/register',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: any }, _, __) => response.data,
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

        getAllServices: builder.mutation<Service[], any>({
            query: (_) => ({
                url: '/services/all',
                method: "GET",
            }),
            transformResponse: (response: { data: Service[] }, _, __) => response.data,
        }),
        getServiceCategories: builder.mutation<ServiceCategory[], any>({
            query: (_) => ({
                url: '/services/categories',
                method: "GET",
            }),
            transformResponse: (response: { data: ServiceCategory[] }, _, __) => response.data,
        }),
        registerService: builder.mutation<Service, any>({
            query: (data) => ({
                url: '/services/register',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: Service }, _, __) => response.data,
        }),
        updateService: builder.mutation<Service, any>({
            query: (data) => ({
                url: '/services/update',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: Service }, _, __) => response.data,
        }),
        registerAditionalMember: builder.mutation<any, any>({
            query: (data) => ({
                url: '/pad/register/aditional',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: any }, _, __) => response.data,
        }),
    }),
});

export const {
    useGetPadCatalogsMutation,
    useRegisterPadCatalogueMutation,
    useRegisterPadCatalogueComponentMutation,
    useDeletePadCatalogueComponentMutation,
    useGetPadCatalogDetailMutation,
    useUpdatePadCatalogueMutation,
    useGetAllServicesMutation,
    useGetServiceCategoriesMutation,
    useRegisterServiceMutation,
    useUpdateServiceMutation,
    useRegisterPadMutation,
    useGetPadsMutation,
    useGetPadServicesMutation,
    useRegisterAditionalMemberMutation
} = padService;