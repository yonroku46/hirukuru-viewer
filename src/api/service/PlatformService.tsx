import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';

export default function PlatformService() {

  async function contactSubmit(data: ServiceInquiry): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.CONTACT_SUBMIT, data);
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function partnerSubmit(data: ServiceApply): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.PARTNER_SUBMIT, data);
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    contactSubmit,
    partnerSubmit,
  };
}