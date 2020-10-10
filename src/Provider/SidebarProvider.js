import React from "react";

const SidebarProviderContext = React.createContext();

export default function SidebarProvider(props) {
  const { children } = props;
  const [sidebarContent, setSidebarContent] = React.useState();
  const [isSideBar, setSidebar] = React.useState(true);
  
  const value = React.useMemo(
    () => ({
      sidebarContent,
      setSidebarContent,
      setSidebar,
      isSideBar
    }),
    [sidebarContent,isSideBar]
  );

  return (
    <SidebarProviderContext.Provider value={value}>
      {children}
    </SidebarProviderContext.Provider>
  );
}

export const useSidebar = () => React.useContext(SidebarProviderContext);
