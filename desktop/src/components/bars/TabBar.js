import React from "react";

/**
 * Render de TabBar
 *
 * @param tabs ARRAY [ @var { key, label, icon, disabled } ]
 * @description Lista com as Tabs a serem exibidas
 *
 * @param selectedTabKey STRING
 * @description representa o valor da chave a Tab atual
 *
 * @param onTabSelect FUNCTION
 * @description função que será chamada passando o objeto Tab por parâmetro, quando for clicada uma Tab
 */

export default function TabBar({ tabs, selectedTabKey, onTabSelect }) {
  return (
    <ul className="nav nav-tabs">
      {tabs.map(tab =>
        tab.disabled ? (
          <li key={tab.key} className="nav-item pointer">
            <button className="btn nav-link disabled" aria-disabled="true">
              {tab.icon && <i className={tab.icon}>&nbsp;</i>}
              {`${tab.label}`}
            </button>
          </li>
        ) : (
          <li
            onClick={() => onTabSelect(tab)}
            key={tab.key}
            className="nav-item pointer"
          >
            {tab.key === selectedTabKey ? (
              <button className="btn nav-link active shadow-none">
                {tab.icon && <i className={tab.icon}>&nbsp;</i>}
                {`${tab.label}`}
              </button>
            ) : (
              <button className="btn nav-link shadow-none">
                {tab.icon && <i className={tab.icon}>&nbsp;</i>}
                {`${tab.label}`}
              </button>
            )}
          </li>
        )
      )}
    </ul>
  );
}
