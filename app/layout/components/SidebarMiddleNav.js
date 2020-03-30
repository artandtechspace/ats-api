import React from 'react';
import {SidebarMenu} from "../../components/SidebarMenu/SidebarMenu";
import {withTranslation} from 'react-i18next'

class SidebarMiddleNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navITEMSs: {
                Item: [
                    {
                        name: "",
                        translation: "SidebarMiddleNav.dashboard",
                        icon: "fa fa-fw fa-home",
                        subItems: [
                            {
                                name: "",
                                translation: "SidebarMiddleNav.overview",
                                path: "/dashboards/analytics",
                            },
                            {
                                name: "",
                                translation: "SidebarMiddleNav.maker",
                                path: "/dashboards/projects",
                            },
                            {
                                name: "",
                                translation: "SidebarMiddleNav.projektlabor",
                                path: "/dashboards/system",
                            },
                            {
                                name: "",
                                translation: "SidebarMiddleNav.projects",
                                path: "/dashboards/stock",
                            },
                            {
                                name: "",
                                translation: "SidebarMiddleNav.delivery",
                                path: "/dashboards/reports",
                            },
                            {
                                name: "",
                                translation: "SidebarMiddleNav.inventory",
                                path: "/dashboards/reports",
                            },
                            {
                                name: "",
                                translation: "SidebarMiddleNav.finances",
                                path: "/dashboards/monitor",
                            },
                            {
                                name: "",
                                translation: "SidebarMiddleNav.overview",
                                path: "/dashboards/financial",
                            },
                            {
                                name: "",
                                translation: "SidebarMiddleNav.events",
                                path: "/dashboards/stock",
                            },
                            {
                                name: "",
                                translation: "SidebarMiddleNav.server",
                                path: "/dashboards/reports",
                            },
                        ]
                    },
                    /*   return (
         <SidebarMenu>
       <SidebarMenu.Item icon={<i className="fa fa-fw fa-columns"></i>} title="Layouts">
           <SidebarMenu.Item title="Navbar" to='/layouts/navbar' exact/>
           <SidebarMenu.Item title="Sidebar" to='/layouts/sidebar' exact/>
           <SidebarMenu.Item title="Sidebar A" to='/layouts/sidebar-a' exact/>
           <SidebarMenu.Item title="Sidebar With Navbar" to="/layouts/sidebar-with-navbar" exact/>
           <SidebarMenu.Item title="Drag &amp; Drop" to='/layouts/dnd-layout' exact/>
       </SidebarMenu.Item>
   </SidebarMenu>
)*/
                    {
                        name: "",
                        translation: "Widgets",
                        to: "/widgets",
                        icon: "fa fa-fw fa-th",
                    },
                    {
                        name: "",
                        translation: "Cards",
                        icon: "fa fa-fw fa-clone",
                        subItems: [
                            {
                                name: "",
                                translation: "Cards",
                                path: "/cards/cards",
                            },
                            {
                                name: "",
                                translation: "Cards Headers",
                                path: "/cards/cardsheaders",
                            },
                        ]
                    }
                ],
            }
        }
    }

    SidebarMenuItem = function (block, translation) {
        switch (block.icon) {
            case undefined:
                if (block.subItems === undefined) {
                    return (
                        <SidebarMenu.Item title={translation(block.translation)}
                                          to={block.to}
                                          exact/>
                    );
                } else {
                    return (
                        <SidebarMenu.Item title={translation(block.translation)}
                                          to={block.to}>
                            {block.subItems ? (
                                block.subItems.map((block =>
                                        this.SidebarMenuItem(block, translation)
                                ))
                            ) : (<div></div>)}
                        </SidebarMenu.Item>
                    )
                }
            default:
                if (block.subItems === undefined) {
                    return (
                        <SidebarMenu.Item icon={<i className={block.icon}></i>}
                                          title={translation(block.translation)}
                                          exact
                        />
                    );
                } else {
                    return (
                        <SidebarMenu.Item icon={<i className={block.icon}></i>}
                                          title={translation(block.translation)}
                        >
                            {block.subItems ? (
                                block.subItems.map((block =>
                                        this.SidebarMenuItem(block, translation)
                                ))
                            ) : (<div></div>)}
                        </SidebarMenu.Item>
                    )
                }
        }

    };

    render() {
        let t;
        ({t} = this.props);
        return (
            <SidebarMenu>
                {
                    this.state.navITEMSs.Item.map((block =>
                            this.SidebarMenuItem(block, t)
                    ))
                }
            </SidebarMenu>
        );
    }

}

export default withTranslation()(SidebarMiddleNav);
