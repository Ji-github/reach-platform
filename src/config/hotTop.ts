export const HOT_TOP_SELECT_VALUE = {
    '已绑定': '7',
    '未绑定': '1',
};

export const HOT_COLUMNS = [
    {
        title: '热榜词ID',
        dataIndex: 'id',
    },
    {
        title: '热榜词',
        dataIndex: 'query',
        slots: {customRender: 'query'}
    },
    {
        title: '绑定时间',
        dataIndex: 'update_time',
        sorter: true,
        slots: {customRender: 'update_time'}
    },
    {
        title: '绑定热点事件',
        dataIndex: 'id',
        slots: {customRender: 'id'}
    },
    {
        title: '绑定状态',
        dataIndex: 'status',
        slots: {customRender: 'status'}
    },
];

export const FORM_ITEMS = [
    {
        title: '热榜词ID',
        propsName: 'id',
        placeHolder: '请输入热榜词ID'
    },
    {
        title: '热榜词',
        propsName: 'query',
        placeHolder: '请输入热榜词'
    },
    {
        title: '绑定状态',
        type: 'select',
        propsName: 'status',
        placeHolder: '请选择绑定状态',
        options: [
            {
                label: '已绑定',
                value: HOT_TOP_SELECT_VALUE['已绑定'],
            },
            {
                label: '未绑定',
                value: HOT_TOP_SELECT_VALUE['未绑定'],
            }
        ]
    },
];

