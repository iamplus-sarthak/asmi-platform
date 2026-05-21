import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const activityLogHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  collection,
}) => {
  console.log(`[ActivityHook] Fired for ${collection.slug} - ${operation}`);
  
  if (!req.user) {
    console.log(`[ActivityHook] No req.user found! Available keys on req:`, Object.keys(req));
    // Let's check if there's any user in req.payload
    // @ts-ignore
    console.log(`[ActivityHook] req.payload.user?`, !!req.payload?.user);
  }

  // We only care about actions performed by actual users (like admins)
  const user = req.user || (req as any).payload?.user;
  // If user is null (custom auth bypassing Payload native auth), we fallback to 'Admin'
  const userName = user?.phone_number || user?.email || user?.name || 'Admin';
  const userId = user?.id || null;

  const collectionName = collection.slug;
  
  // Format slug to readable string (e.g. "support_tickets" -> "Support ticket")
  const formattedName = collectionName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Remove trailing "s" if it exists to make it singular (e.g. "Users" -> "User")
  const singularName = formattedName.endsWith('s') 
    ? formattedName.slice(0, -1) 
    : formattedName;

  let actionStr = '';

  if (operation === 'create') {
    actionStr = `Created new ${singularName.toLowerCase()}`;
  } else if (operation === 'update') {
    actionStr = `Updated ${singularName.toLowerCase()}`;
  }

  // A few overrides for core collections that sound better with custom text
  if (collectionName === 'users') {
    actionStr = operation === 'create' ? `New user registered` : `Updated user details`;
  } else if (collectionName === 'payments') {
    actionStr = operation === 'create' ? `Payment processed` : `Payment updated`;
  }

  // Only create the log if we have an action string
  if (actionStr) {
    try {
      const created = await req.payload.create({
        collection: 'admin_activity_logs',
        req,
        data: {
          action: actionStr,
          user_name: userName,
          user_id: userId,
          resource_collection: collectionName,
          resource_id: String(doc.id),
        },
      });
      console.log(`[ActivityHook] Log created successfully:`, created.id);
    } catch (err) {
      console.error('[ActivityHook] Failed to log admin activity:', err);
    }
  }

  return doc;
}

export const activityLogDeleteHook: CollectionAfterDeleteHook = async ({
  req,
  id,
  doc,
  collection,
}) => {
  console.log(`[ActivityHook] DELETE Fired for ${collection.slug}`);
  const user = req.user || (req as any).payload?.user;
  const userName = user?.phone_number || user?.email || user?.name || 'Admin';
  const userId = user?.id || null;

  const collectionName = collection.slug;
  const formattedName = collectionName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  const singularName = formattedName.endsWith('s') 
    ? formattedName.slice(0, -1) 
    : formattedName;

  const actionStr = `Deleted ${singularName.toLowerCase()}`;

  try {
    await req.payload.create({
      collection: 'admin_activity_logs',
      req,
      data: {
        action: actionStr,
        user_name: userName,
        user_id: userId,
        resource_collection: collectionName,
        resource_id: String(id),
      },
    });
  } catch (err) {
    console.error('[ActivityHook] Failed to log admin delete activity:', err);
  }

  return doc;
}
