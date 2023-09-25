/*Type definitions to export for Declarations*/
type HeaderMegaNavProps = {
  megaNavData: MegaNavChildren[];
  composedHeader?: any;
  lineItemCount?: number;
};

type MegaNavChildren = {
  label: string;
  href: string;
  isLeaf: Boolean;
  deliveryId: string;
  theme: String;
  thumbnail: String;
  altText: string;
  children: [MegaNavChildren];
  isFromDrawer: Boolean;
  departmentFromChild?: Object;
  handleDepartmentFromChildChange?: Function;
  parentTab: string;
};

type MegaNavRoot = {
  label: String;
  isLeaf: Boolean;
  children: [MegaNavChildren];
};

type MegaNavTypeFromBff = {
  __typename: String;
  _root: MegaNavRoot;
};

type MegaNavTypeRaw = {
  data: {
    MegaNav: MegaNavTypeFromBff;
  };
};

export type { HeaderMegaNavProps, MegaNavChildren, MegaNavTypeRaw };
