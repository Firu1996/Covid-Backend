interface IBodyResponse {
  success: boolean;
  data?: any;
  msg?: string;
}

export abstract class BaseController {
  protected responseData: IBodyResponse = { success: false };
}
