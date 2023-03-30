import React, { FC } from 'react';
import { useImmer } from 'use-immer';

interface Param {
  id: number;
  name: string;
}

interface ParamValue {
  paramId: number;
  value: string | string[];
}

interface Model {
  paramValues: ParamValue[];
  colors: string[];
}

interface ParamEditorProps {
  params: Param[];
  model: Model;
}

const params: Param[] = [
  {
    id: 1,
    name: 'Назначение',
  },
  {
    id: 2,
    name: 'Длина',
  },
  {
    id: 3,
    name: 'Params'
  }
];

const model: Model = {
  paramValues: [
    {
      paramId: 1,
      value: 'повседневное',
    },
    {
      paramId: 2,
      value: 'макси',
    },
    {
      paramId: 3,
      value: [
        'один', 'два', 'три'
      ]
    }
  ],
  colors: [],
};

interface ParamItemProps {
  param: ParamValue;
  label: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, id: number, idx?: number) => void;
}

function isString(x: any): x is string {
  return typeof x === 'string';
}

const ParamItem: FC<ParamItemProps> = ({ param, label, handleChange }) => {
  return (
    <div className={isString(param.value) ? 'itemRow' : 'itemColumn'}>
      <label
        htmlFor={param.paramId.toString()}
        className={'label'}
      >
        {label}
      </label>
      {isString(param.value) ? <input
        id={param.paramId.toString()}
        type="text"
        value={param.value}
        className={'input'}
        onChange={(e) => handleChange(e, param.paramId)}
      /> : param.value.map((v, index) => (
        <input
          key={index}
          type="text"
          value={v}
          className={'input'}
          onChange={(e) => handleChange(e, param.paramId, index)}
        />))}
    </div>
  );
};

const ParamEditor: FC<ParamEditorProps> = ({ params, model }) => {
  const [editor, setEditor] = useImmer<ParamEditorProps>({ params, model });

  const getModel = () => {
    alert(JSON.stringify(editor.model));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, id: number, idx?: number) => {
    const currentInput = editor.model.paramValues.findIndex(p => p.paramId === id);

    if (currentInput === undefined) {
      return;
    }

    if (idx === undefined) {
      setEditor(draft => {
        draft.model.paramValues[currentInput].value = event.target.value;
      });
      return;
    }
      setEditor(draft => {
        // @ts-ignore
        draft.model.paramValues[currentInput].value[idx] = event.target.value;
      })
  };

  return (
    <div className={'container'}>
      <button className={'button'} onClick={getModel}>getModel</button>
      {editor.params.map(param => {
          const currentParam = editor.model.paramValues.find(p => p.paramId === param.id);
          if (!currentParam) {
            return null;
          }
          return <ParamItem key={param.id} param={currentParam} label={param.name} handleChange={handleChange} />;
        },
      )}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <ParamEditor params={params} model={model} />
    </div>
  );
};

export default App;
