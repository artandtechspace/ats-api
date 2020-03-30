import React, {Component} from 'react';
import {SidebarMenu} from './../../components';
import {withTranslation} from 'react-i18next';
import SidebarMenujson from "../../config/SidebarNav.json";

class SidebarMiddleNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Sidebar: SidebarMenujson
        };
    }

    render() {
        const {t} = this.props;
        return (
            <SidebarMenu>
                {this.state.Sidebar.SidebarMenu.map()}
                <SidebarMenu.Item icon={<i className="fa fa-fw fa-mouse-pointer"></i>} title="Kommunikation">
                    <SidebarMenu.Item title="Projects">
                        <SidebarMenu.Item title="Projects List" to="/apps/projects/list"/>
                        <SidebarMenu.Item title="Projects Grid" to="/apps/projects/grid"/>
                    </SidebarMenu.Item>
                    <SidebarMenu.Item title="Tasks">
                        <SidebarMenu.Item title="Tasks List" to="/apps/tasks/list"/>
                        <SidebarMenu.Item title="Tasks Grid" to="/apps/tasks/grid"/>
                        <SidebarMenu.Item title="Tasks Kanban" to="/apps/tasks-kanban"/>
                        <SidebarMenu.Item title="Tasks Details" to="/apps/task-details"/>
                    </SidebarMenu.Item>
                    <SidebarMenu.Item title="Files">
                        <SidebarMenu.Item title="Files List" to="/apps/files/list"/>
                        <SidebarMenu.Item title="Files Grid" to="/apps/files/grid"/>
                    </SidebarMenu.Item>
                    <SidebarMenu.Item title="Search Results">
                        <SidebarMenu.Item title="Search Results" to="/apps/search-results"/>
                        <SidebarMenu.Item title="Images Results" to="/apps/images-results"/>
                        <SidebarMenu.Item title="Videos Results" to="/apps/videos-results"/>
                        <SidebarMenu.Item title="Users Results" to="/apps/users-results"/>
                    </SidebarMenu.Item>
                    <SidebarMenu.Item title="Users">
                        <SidebarMenu.Item title="Users List" to="/apps/users/list"/>
                        <SidebarMenu.Item title="Users Grid" to="/apps/users/grid"/>
                    </SidebarMenu.Item>
                    <SidebarMenu.Item title="Gallery">
                        <SidebarMenu.Item title="Gallery Grid" to="/apps/gallery-grid"/>
                        <SidebarMenu.Item title="Gallery Table" to="/apps/gallery-table"/>
                    </SidebarMenu.Item>
                    <SidebarMenu.Item title="Mailbox">
                        <SidebarMenu.Item title="Inbox" to="/apps/inbox"/>
                        <SidebarMenu.Item title="New Email" to="/apps/new-email"/>
                        <SidebarMenu.Item title="Email Details" to="/apps/email-details"/>
                    </SidebarMenu.Item>
                    <SidebarMenu.Item title="Profile">
                        <SidebarMenu.Item title="Profile Details" to="/apps/profile-details"/>
                        <SidebarMenu.Item title="Profile Edit" to="/apps/profile-edit"/>
                        <SidebarMenu.Item title="Account Edit" to="/apps/account-edit"/>
                        <SidebarMenu.Item title="Billing Edit" to="/apps/billing-edit"/>
                        <SidebarMenu.Item title="Settings Edit" to="/apps/settings-edit"/>
                        <SidebarMenu.Item title="Sessions Edit" to="/apps/sessions-edit"/>
                    </SidebarMenu.Item>
                    <SidebarMenu.Item title="Clients" to="/apps/clients" exact/>
                    <SidebarMenu.Item title="Chat" to="/apps/chat" exact/>
                </SidebarMenu.Item>
            </SidebarMenu>
        )
    }
}

export default (withTranslation)(SidebarMiddleNav);