// import React from 'react';
// import { mount } from 'enzyme';
// import Switch from '@coralui/react-coral/lib/Switch';
// import { Field } from 'redux-form';
//
// import RegexToggle from '../regexToggle';
//
// const getReactComponents = (wrapper) => {
//   const regexSwitch = wrapper.find(Switch).node;
//   const testButton = wrapper.find('button');
//
//   return {
//     regexSwitch,
//     testButton
//   };
// };
//
// const render = props => mount(
//     <Field
//       name="valueIsRegex"
//       component={ RegexToggle }
//       valueFieldName="value"
//     />
//   );
//
// describe('regex toggle', () => {
//   let instance;
//
//   beforeEach(() => {
//     window.extensionBridge = {
//       openRegexTester: jasmine.createSpy().and.callFake((value, callback) => {
//         callback('bar');
//       })
//     };
//
//     instance = mount(
//       <Field
//         name="valueIsRegex"
//         component={ RegexToggle }
//         valueFieldName="value"
//       />
//     );
//   });
//
//   afterEach(() => {
//     delete window.extensionBridge;
//   });
//
//   fit('sets switch to checked when valueIsRegex=true', () => {
//     const { regexSwitch } = getReactComponents(instance);
//
//     expect(regexSwitch.props.checked).toBe(true);
//   });
//
//   it('calls onChange from ValueIsRegex field when switch is toggled', () => {
//     const onValueIsRegexChange = jasmine.createSpy();
//     const { regexSwitch } = getReactComponents(render({
//       names: ['value', 'valueIsRegex'],
//       valueIsRegex: {
//         input: {
//           onChange: onValueIsRegexChange
//         }
//       }
//     }));
//
//     regexSwitch.props.onChange({
//       target: {
//         checked: true
//       }
//     });
//
//     expect(onValueIsRegexChange).toHaveBeenCalledWith(true);
//   });
//
//   it('supports regex testing+updating workflow', () => {
//     const onValueChange = jasmine.createSpy();
//     const { testButton } = getReactComponents(render({
//       names: ['value', 'valueIsRegex'],
//       value: {
//         input: {
//           value: 'foo',
//           onChange: onValueChange
//         }
//       },
//       valueIsRegex: {
//         input: {
//           value: true
//         }
//       }
//     }));
//
//     testButton.simulate('click');
//
//     expect(window.extensionBridge.openRegexTester)
//       .toHaveBeenCalledWith('foo', jasmine.any(Function));
//     expect(onValueChange).toHaveBeenCalledWith('bar');
//   });
//
//   it('shows test link when valueIsRegex=true', () => {
//     const { testButton } = getReactComponents(render({
//       names: ['value', 'valueIsRegex'],
//       valueIsRegex: {
//         input: {
//           value: true
//         }
//       }
//     }));
//
//     expect(testButton.node.style.visibility).toBe('visible');
//   });
//
//   it('hides test link when valueIsRegex=false', () => {
//     const { testButton } = getReactComponents(render({
//       names: ['value', 'valueIsRegex'],
//       valueIsRegex: {
//         input: {
//           value: false
//         }
//       }
//     }));
//
//     expect(testButton.node.style.visibility).toBe('hidden');
//   });
// });
