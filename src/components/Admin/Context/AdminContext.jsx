import { createContext } from "react";

const AdminContext = createContext({
  name: "",
  setName: () => {},
  avatar: null,
  setAvatar: () => {},
  dob: "",
  setDob: () => {},
  canAccessAdmin: false, // флаг доступа
  setCanAccessAdmin: () => {}
});

export default AdminContext;
