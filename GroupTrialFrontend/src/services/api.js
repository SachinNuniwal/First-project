import { colors } from "sockjs-client/dist/sockjs";
import { normalizeMessage } from "../utils/chatHelpers";

// TODO: Replace with backend API endpoint to validate user
const validateUserEndpointBase = "http://localhost:8080/group_member/check_user_exists";

// TODO: Replace with backend API endpoint to fetch groups for user
const getGroupsEndpoint = "http://localhost:8080/group/by_id";

// Backend endpoint to fetch messages for a group
const getMessagesEndpoint = "http://localhost:8081/all_messages/{groupId}";

async function safeParseJson(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

// export async function validateUserId(userId) {
//   // TODO: Replace with actual backend endpoint
//   const response = await fetch(validateUserEndpoint, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ userId })
//   });

//   if (!response.ok) {
//     throw new Error("Unable to validate user at the moment.");
//   }

//   const data = await safeParseJson(response);
//   if (typeof data?.valid === "boolean") {
//     return data.valid;
//   }

//   if (typeof data?.isValid === "boolean") {
//     return data.isValid;
//   }

//   return true;
// }

export async function validateUserId(userId) {
  const endpoint = `${validateUserEndpointBase}/${encodeURIComponent(userId)}`;

  const response = await fetch(endpoint, {
    method: "GET", // GET because path variable
    headers: {
      "Content-Type": "application/json"
    }
  });

  // ✅ Check status code
  if (response.status === 200) {
    return true; // User exists
  } else if (response.status === 404) {
    return false; // User not found
  } else {
    throw new Error("Unable to validate user at the moment.");
  }
}



// export async function fetchUserGroups(userId) {
//   // TODO: Replace with actual backend endpoint
//   const response = await fetch(getGroupsEndpoint, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ userId })
//   });

//   if (!response.ok) {
//     throw new Error("Unable to fetch groups for this user.");
//   }

//   const data = await safeParseJson(response);

//   if (Array.isArray(data)) {
//     return data;
//   }

//   if (Array.isArray(data?.groups)) {
//     return data.groups;
//   }

//   return [];
// }
export async function fetchUserGroups(userId) {
  const endpoint = `${getGroupsEndpoint}/${encodeURIComponent(userId)}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Unable to fetch groups for this user.");
  }
  console.log("Raw response for groups:", await response.clone().text()); // Log raw response text
  const data = await safeParseJson(response); // Array of GroupMember

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((member) => {
    const parsedGroupName = (() => {
      if (!member.groupName || typeof member.groupName !== "string") {
        return member.groupName || "Unnamed Group";
      }

      try {
        const candidate = JSON.parse(member.groupName);
        return candidate?.name || candidate?.groupName || member.groupName;
      } catch {
        return member.groupName;
      }
    })();

    return {
      groupId:
        (member.group && (member.group.id ?? member.group.groupId)) ?? member.groupId ?? member.id ?? "",
      groupName: parsedGroupName,
      role: member.role,
      joinedAt: member.joinedAt
    };
  });
}

export async function fetchGroupMessages(groupId) {
  const endpoint = getMessagesEndpoint.replace("{groupId}", encodeURIComponent(groupId));

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Unable to fetch messages for this group.");
  }

  const data = await safeParseJson(response);
  const items = Array.isArray(data) ? data : Array.isArray(data?.messages) ? data.messages : [];
  return items.map((message) => normalizeMessage(message, groupId));
}

