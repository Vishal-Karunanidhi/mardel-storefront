type NotifyMeRequest = {
  emailAddress: string;
  productCode: string;
};

type NotifyMeResponse = {
  notifyMe: {
    status: number;
    message: string;
  };
};

export type { NotifyMeRequest, NotifyMeResponse };
