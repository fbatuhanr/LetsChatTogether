import React from 'react';

export function Events({ events }: {events: any}) {
  return (
    <ul>
    {
      events.map((event:any, index:number) =>
        <li key={ index }>{ event }</li>
      )
    }
    </ul>
  );
}