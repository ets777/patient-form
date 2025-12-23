import MenuItem from "./MenuItem";
import Image from "next/image";

export default function Sidebar(props: { pageId: string; }) {

  const menuItems = [
    {
      menuItemId: "PatientForm",
      menuItemText: "Patient Form",
      menuItemActive: false,
      menuItemLink: '/'
    },
    {
      menuItemId: "StaffForm",
      menuItemText: "Staff Form",
      menuItemActive: false,
      menuItemLink: '/staff-form'
    },
  ]

  return (
    <div className="flex flex-col min-w-[100%] xl:max-w-[328px] xl:min-w-[268px] justify-between items-start gap-6 p-6 rounded-2xl border-slate-100 border-t border-b border-l border-r border-solid border bg-slate-50">
      <div className="flex flex-col sm:flex-row xl:flex-col justify-center sm:justify-start sm:items-start gap-6 w-[100%] sm:w-[400px] xl:w-[100%]">
        <div className="flex justify-center w-[100%]">
          <Image className="w-[100px] min-w-[100px] xl:w-[50%] center" width="200" height="175" src="/medicallogo.png" alt="medical-logo" />
        </div>
        <div className="flex flex-col justify-start items-start w-[100%]">
          {menuItems.map(
            ({
              menuItemId,
              menuItemText,
              menuItemLink
            }) => (
              <MenuItem
                key={menuItemId}
                menuItemText={menuItemText}
                menuItemActive={(menuItemId == props.pageId) ? true : false}
                menuItemLink={menuItemLink}
              />
            )
          )}
        </div>
      </div>
    </div>
  )
}