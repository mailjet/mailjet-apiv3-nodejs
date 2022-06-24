require(
    [
        'mailjet',
        'app/init',
        'app/getMessages',
        'app/getContacts',
        'app/getContactLists',
        'app/getTemplates',
        'app/getClickStatistic',
        'app/getOpenStatistic',
    ],
    (
        mailjet,
        init,
        getMessages,
        getContacts,
        getContactLists,
        getTemplates,
        getClickStatistic,
        getOpenStatistic,
    ) => {
        const getMessagesElement = document.getElementById('get_messages')
        const getContactsElement = document.getElementById('get_contacts')
        const getContactListsElement = document.getElementById('get_contact_lists')
        const getTemplatesElement = document.getElementById('get_templates')
        const getClickStatisticElement = document.getElementById('get_click_statistic')
        const getOpenStatisticElement = document.getElementById('get_open_statistic')

        const Client = mailjet.Client;
        const Request = mailjet.Request;

        // // TODO: hack for the proxy
        // const proxyUrl = 'http://localhost:3100'
        // const originalBuildFullUrl = Request.prototype.buildFullUrl;
        // Request.prototype.buildFullUrl = function () {
        //     const url = originalBuildFullUrl.call(this);
        //     return url.replace(
        //         `${Request.protocol}${Client.config.host}`,
        //         proxyUrl
        //     )
        // }

        init(Client);

        getMessages(getMessagesElement);
        getContacts(getContactsElement);
        getContactLists(getContactListsElement);
        getTemplates(getTemplatesElement);
        getClickStatistic(getClickStatisticElement);
        getOpenStatistic(getOpenStatisticElement);
    }
)
