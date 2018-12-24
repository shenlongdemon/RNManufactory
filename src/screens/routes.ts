export const ROUTE = {
  LOGIN: 'login',
  SWITCHFEATURE: {
    DEFAULT: 'switchfeature',
  },
  APP: {
    SHARE: {
      BLUETOOTH: 'bluetooth',
      QRCODE: 'qrcode',
    },
    USER: {
      DEFAULT: 'user',
    },
    MANUFACTORY: {
      DEFAULT: 'manufactory',
      GOODSES: {
        DEFAULT: 'goodses',
        ITEM: {
          DEFAULT: 'goodsdetail'
        }
      },
      MATERIALS: {
        DEFAULT: 'materials',
        ITEM: {
          DEFAULT: 'materialdetail',
          PROCESS: {
            DEFAULT: 'processdetail',
            TASK: {
              DEFAULT: 'taskdetail',
              WORKERS: {
                DEFAULT: 'workers',
                ACTIVITIES: {
                  DEFAULT: 'activities',
                  ADD_ACTIVITY : 'addactivity'
                },
              },
            },
            
          },
        },
        ADD_iTEM: {
          DEFAULT: 'addmaterial'
        },
        
      },
      SCANQRCODE: 'qrcode',
      BLUETOOTH: 'bluetooth'
      
    },
  },
}
