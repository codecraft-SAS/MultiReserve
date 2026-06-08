import api from "../api/axios";
import type { Resource } from "../types/Resource";

export const getResources = async (): Promise<Resource[]> => {

  const response = await api.get("/resources");

  return response.data;
};

export const getResourceById = async (
  id: number
): Promise<Resource> => {

  const response = await api.get(`/resources/${id}`);

  return response.data;
};

export const getResourcesByBusiness = async (
  businessId: number
): Promise<Resource[]> => {

  const response = await api.get(
    `/resources/business/${businessId}`
  );

  return response.data;
};