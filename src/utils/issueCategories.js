export const ISSUE_CATEGORIES = [
  {
    id: 'WRONG_ITEM',
    label: 'Wrong Item',
    explanation: 'An item delivered does not match your order.',
    icon: 'wrong_location'
  },
  {
    id: 'MISSING_ITEM',
    label: 'Missing Item',
    explanation: 'An item shown in your order has not been delivered.',
    icon: 'event_busy'
  },
  {
    id: 'FOOD_COLD',
    label: 'Food Is Cold',
    explanation: 'Food delivered was not served hot or at the right temperature.',
    icon: 'ac_unit'
  },
  {
    id: 'QUALITY_ISSUE',
    label: 'Quality Issue',
    explanation: 'Taste, texture, or preparation did not meet expectations.',
    icon: 'thumb_down'
  },
  {
    id: 'ALLERGY_CONCERN',
    label: 'Allergy Concern',
    explanation: 'Urgent check for ingredient or allergen cross-contact concern.',
    icon: 'warning'
  },
  {
    id: 'EXCESSIVE_DELAY',
    label: 'Excessive Delay',
    explanation: 'Preparation or delivery has exceeded expected waiting time.',
    icon: 'hourglass_empty'
  },
  {
    id: 'BILLING_ISSUE',
    label: 'Billing Issue',
    explanation: 'Discrepancy in item prices, discounts, or total bill.',
    icon: 'receipt_long'
  },
  {
    id: 'MANAGER_ASSISTANCE',
    label: 'Need Manager Assistance',
    explanation: 'Speak directly to shift manager about your table.',
    icon: 'support_agent'
  },
  {
    id: 'OTHER',
    label: 'Other',
    explanation: 'Any other operational or dining query.',
    icon: 'more_horiz'
  }
];

export const REPORT_STAGES = [
  { id: 'REPORTED', title: 'Report Received', subtitle: "We've logged your concern", icon: 'ClipboardCheck' },
  { id: 'OWNER_ASSIGNED', title: 'Staff Assigned', subtitle: 'A team member has taken ownership', icon: 'UserCheck' },
  { id: 'ACTION_IN_PROGRESS', title: 'Resolution In Progress', subtitle: "We're actively making it right", icon: 'Sparkles' },
  { id: 'WAITING_FOR_CUSTOMER', title: 'Waiting for Confirmation', subtitle: 'Just need your thumbs-up', icon: 'BellRing' },
  { id: 'RESOLVED', title: 'Resolved', subtitle: 'All done — thank you for your patience', icon: 'PartyPopper' },
];
