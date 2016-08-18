'use strict';

module.exports = {
  dataElements: {
    'DE_One': {
      modulePath: 'dtm/src/lib/dataElements/variable.js',
      settings: {
        path:'_dl.test'
      }
    }
  },
  rules: [
    {
      name: 'Sequential Global JS Rule',
      events: [
        {
          modulePath: 'dtm/src/lib/events/click.js',
          settings: {
            elementSelector: '#SG'
          },
        }
      ],
      conditions: [],
      actions: [
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 1',
            source: '/files/sequential_global_1.js',
            language: 'javascript',
            sequential: true,
            global: true,
            codeId: 'abc'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 2',
            source: '/files/sequential_global_2.js',
            language: 'javascript',
            sequential: true,
            global: true,
            codeId: 'def'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 3',
            source: '/files/sequential_global_3.js',
            language: 'javascript',
            sequential: true,
            global: true,
            codeId: 'ghi'
          }
        }
      ]
    },
    {
      name: 'Non Sequential Global JS Rule',
      events: [
        {
          modulePath: 'dtm/src/lib/events/click.js',
          settings: {
            elementSelector: '#NSG'
          },
        }
      ],
      conditions: [],
      actions: [
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Non Sequential Global 1',
            source: '/files/non_sequential_global_1.js',
            language: 'javascript',
            sequential: false,
            global: true,
            codeId: 'abc'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Non Sequential Global 2',
            source: '/files/non_sequential_global_2.js',
            language: 'javascript',
            sequential: false,
            global: true,
            codeId: 'def'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Non Sequential Global 3',
            source: '/files/non_sequential_global_3.js',
            language: 'javascript',
            sequential: false,
            global: true,
            codeId: 'ghi'
          }
        }
      ],
    },
    {
      name: 'Sequential Non Global JS Rule',
      events: [
        {
          modulePath: 'dtm/src/lib/events/click.js',
          settings: {
            elementSelector: '#SNG'
          },
        }
      ],
      conditions: [],
      actions: [
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 1',
            source: '/files/sequential_non_global_1.js',
            language: 'javascript',
            sequential: true,
            global: false,
            codeId: 'abc'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 2',
            source: '/files/sequential_non_global_2.js',
            language: 'javascript',
            sequential: true,
            global: false,
            codeId: 'def'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 3',
            source: '/files/sequential_non_global_3.js',
            language: 'javascript',
            sequential: true,
            global: false,
            codeId: 'ghi'
          }
        }
      ],
    },
    {
      name: 'Non Sequential Non Global JS Rule',
      events: [
        {
          modulePath: 'dtm/src/lib/events/click.js',
          settings: {
            elementSelector: '#NSNG'
          },
        }
      ],
      conditions: [],
      actions: [
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 1',
            source: '/files/non_sequential_non_global_1.js',
            language: 'javascript',
            sequential: false,
            global: false,
            codeId: 'abc'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 2',
            source: '/files/non_sequential_non_global_2.js',
            language: 'javascript',
            sequential: false,
            global: false,
            codeId: 'def'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 3',
            source: '/files/non_sequential_non_global_3.js',
            language: 'javascript',
            sequential: false,
            global: false,
            codeId: 'ghi'
          }
        }
      ],
    },
    {
      name: 'Sequential HTML Rule (Should Fail)',
      events: [
        {
          modulePath: 'dtm/src/lib/events/click.js',
          settings: {
            elementSelector: '#HTML'
          },
        }
      ],
      conditions: [],
      actions: [
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential HTML 1',
            source: '\u003cscript\u003econsole.log("Sequential HTML script 1")\nconsole.log("DE_One Data Element Value : \'%DE_One%\'")\nconsole.log("Invalid Data Element Value : \'%DE_Two%\'")\u003c/script\u003e',
            language: 'html',
            sequential: true
          }
        },
      ],
    },
    {
      name: 'Non Sequential HTML Rule',
      events: [
        {
          modulePath: 'dtm/src/lib/events/click.js',
          settings: {
            elementSelector: '#NHTML'
          },
        }
      ],
      conditions: [],
      actions: [
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Non Sequential HTML 1',
            source: '/files/non_sequential_HTML_1.html',
            language: 'html',
            sequential: false
          }
        },
      ],
    },
    {
      name: 'ALL Custom Scripts Rule',
      events: [
        {
          modulePath: 'dtm/src/lib/events/click.js',
          settings: {
            elementSelector: '#ALL'
          },
        }
      ],
      conditions: [],
      actions: [
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 1',
            source: '/files/sequential_global_1.js',
            language: 'javascript',
            sequential: true,
            global: true,
            codeId: 'abc'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 2',
            source: '/files/sequential_global_2.js',
            language: 'javascript',
            sequential: true,
            global: true,
            codeId: 'def'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 3',
            source: '/files/sequential_global_3.js',
            language: 'javascript',
            sequential: true,
            global: true,
            codeId: 'ghi'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Non Sequential Global 1',
            source: '/files/non_sequential_global_1.js',
            language: 'javascript',
            sequential: false,
            global: true,
            codeId: 'abc'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Non Sequential Global 2',
            source: '/files/non_sequential_global_2.js',
            language: 'javascript',
            sequential: false,
            global: true,
            codeId: 'def'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Non Sequential Global 3',
            source: '/files/non_sequential_global_3.js',
            language: 'javascript',
            sequential: false,
            global: true,
            codeId: 'ghi'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 1',
            source: '/files/sequential_non_global_1.js',
            language: 'javascript',
            sequential: true,
            global: false,
            codeId: 'abc'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 2',
            source: '/files/sequential_non_global_2.js',
            language: 'javascript',
            sequential: true,
            global: false,
            codeId: 'def'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 3',
            source: '/files/sequential_non_global_3.js',
            language: 'javascript',
            sequential: true,
            global: false,
            codeId: 'ghi'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 1',
            source: '/files/non_sequential_non_global_1.js',
            language: 'javascript',
            sequential: false,
            global: false,
            codeId: 'abc'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 2',
            source: '/files/non_sequential_non_global_2.js',
            language: 'javascript',
            sequential: false,
            global: false,
            codeId: 'def'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 3',
            source: '/files/non_sequential_non_global_3.js',
            language: 'javascript',
            sequential: false,
            global: false,
            codeId: 'ghi'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential HTML 1',
            source: '\u003cscript\u003econsole.log("Sequential HTML script 1")\nconsole.log("DE_One Data Element Value : \'%DE_One%\'")\nconsole.log("Invalid Data Element Value : \'%DE_Two%\'")\u003c/script\u003e',
            language: 'html',
            sequential: true
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Non Sequential HTML 1',
            source: '/files/non_sequential_HTML_1.html',
            language: 'html',
            sequential: false
          }
        },
      ],
    },
    {
      name: 'Random Rule',
      events: [
        {
          modulePath: 'dtm/src/lib/events/click.js',
          settings: {
            elementSelector: '#RANDOM'
          },
        }
      ],
      conditions: [],
      actions: [
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Non Sequential HTML 1',
            source: '/files/non_sequential_HTML_1.html',
            language: 'html',
            sequential: false
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Non Sequential Global 3',
            source: '/files/non_sequential_global_3.js',
            language: 'javascript',
            sequential: false,
            global: true,
            codeId: 'ghi'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 1',
            source: '/files/sequential_global_1.js',
            language: 'javascript',
            sequential: true,
            global: true,
            codeId: 'abc'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 2',
            source: '/files/sequential_global_2.js',
            language: 'javascript',
            sequential: true,
            global: true,
            codeId: 'def'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential Global 1',
            source: '/files/non_sequential_non_global_1.js',
            language: 'javascript',
            sequential: false,
            global: false,
            codeId: 'abc'
          }
        },
      ],
    },
    {
      name: 'Page Load Sequential Rule',
      events: [
        {
          modulePath: 'dtm/src/lib/events/pageTop.js'
        }
      ],
      conditions: [],
      actions: [
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'PL Sequential Global 1',
            source: '/files/pl_sequential_global_1.js',
            language: 'javascript',
            sequential: true,
            global: true,
            codeId: 'abc'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'PL Sequential Global 1',
            source: '/files/pl_sequential_global_2.js',
            language: 'javascript',
            sequential: true,
            global: true,
            codeId: 'def'
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'PL Sequential HTML 1',
            source: '\u003cscript\u003econsole.log("PL Sequential HTML script Numero One")\nconsole.log("DE_One Data Element Value : \'%DE_One%\'")\nconsole.log("Invalid Data Element Value : \'%DE_Two%\'")\u003c/script\u003e',
            language: 'html',
            sequential: true
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'Sequential HTML H1 tag',
            source: '\u003cscript\u003ewindow.plshtml = \"This is the plshtml String\";\nconsole.log("Window Object plshtml should now be set");\u003c/script\u003e',
            language: 'html',
            sequential: true
          }
        },
      ],
    },
    {
      name: 'Page Load NON Sequential Rule',
      events: [
        {
          modulePath: 'dtm/src/lib/events/pageTop.js'
        }
      ],
      conditions: [],
      actions: [
        { <!-- leave this here and ensure there is a processing (interpretatation) error -->
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'PL NON Sequential HTML (Wrong Type)',
            source: '/files/pl_sequential_global_2.js',
            language: 'html',
            sequential: false
          }
        },
        {
          modulePath: 'dtm/src/lib/actions/custom.js',
          settings: {
            name: 'PL NON Sequential HTML 2',
            source: '/files/pl_non_sequential_HTML_1.html',
            language: 'html',
            sequential: false
          }
        },
      ],
    }
  ],
  propertySettings: {},
  buildInfo: {
    appVersion: '52A',
    buildDate: '2015-03-16 20:55:42 UTC',
    publishDate: '2015-03-16 14:43:44 -0600',
    environment: 'development'
  }
};
