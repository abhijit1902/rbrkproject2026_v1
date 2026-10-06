import React from 'react';

function Row({ icon, label, children }) {
  return (
    <div className="flex items-start justify-between gap-space-md py-2 border-b border-[#3858a6]/40 last:border-b-0">
      <div className="flex items-center gap-space-xs text-on-surface-variant text-xs font-medium whitespace-nowrap">
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
        {label}
      </div>
      <div className="text-xs text-on-surface font-semibold text-right">{children}</div>
    </div>
  );
}

function Person({ person }) {
  if (!person) return <span className="text-on-surface-variant">—</span>;
  return (
    <div className="flex flex-col items-end">
      <span>{person.name}</span>
      {person.email && (
        <a href={'mailto:' + person.email} className="text-[11px] font-normal text-primary no-underline hover:underline">
          {person.email}
        </a>
      )}
    </div>
  );
}

export default function BasicAccountDetailsCard({ account }) {
  const d = account.basicDetails || {};

  return (
    <div className="p-space-lg rounded-xl bg-[#1c3f96]/40 border border-[#3858a6] shadow-md flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs text-on-surface font-headline-sm text-base font-bold">
          <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
          <h3 className="m-0">Basic Account Details</h3>
        </div>
        <span className="font-code-sm text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
          Account Profile
        </span>
      </div>

      <div className="flex flex-col">
        <Row icon="request_quote" label="TCV">{d.tcv || '—'}</Row>
        <Row icon="public" label="Region">{d.region || <span className="text-on-surface-variant font-normal">Not set</span>}</Row>
        {d.territory && <Row icon="map" label="Territory">{d.territory}</Row>}
        <Row icon="event" label="Customer Since">{d.customerSince || '—'}</Row>
        <Row icon="account_tree" label="Parent Company">
          {d.parentCompany ? d.parentCompany : <span className="text-on-surface-variant font-normal">None (standalone)</span>}
        </Row>
        <Row icon="person" label="Account Executive (AE)"><Person person={d.ae} /></Row>
        <Row icon="engineering" label="Sales Engineer (SE)">
          {d.se ? <Person person={d.se} /> : <span className="text-on-surface-variant font-normal">Not assigned</span>}
        </Row>
        {d.renewalOwner && <Row icon="event_repeat" label="Renewal Owner">{d.renewalOwner}</Row>}
        {d.customerExecs && d.customerExecs.length > 0 && (
          <Row icon="groups" label="Customer Exec Candidates">
            <div className="flex flex-col items-end gap-1">
              {d.customerExecs.map(e => (
                <div key={e.name} className="flex flex-col items-end">
                  <span>{e.name}</span>
                  <span className="text-[11px] font-normal text-on-surface-variant">{e.title}</span>
                </div>
              ))}
            </div>
          </Row>
        )}
      </div>
    </div>
  );
}
