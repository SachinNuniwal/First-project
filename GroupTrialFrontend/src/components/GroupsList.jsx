import { getGroupGradient, getGroupId, getGroupInitials, getGroupName } from "../utils/chatHelpers";

function GroupsList({ userId, groups, currentGroupId, isLoading, onSelectGroup, onLogout }) {
  return (
    <section className="groups-list-wrap">
      <header className="groups-header">
        <div>
          <p className="groups-label">Logged In As</p>
          <h2>{userId}</h2>
        </div>
        <button type="button" className="ghost-btn" onClick={onLogout}>
          Logout
        </button>
      </header>

      <div className="groups-list">
        {isLoading ? (
          <p className="state-text">Loading groups...</p>
        ) : null}

        {!isLoading && groups.length === 0 ? (
          <p className="state-text">No groups found for this user yet.</p>
        ) : null}

        {groups.map((group, index) => {
          const groupId = getGroupId(group);
          const groupName = getGroupName(group);
          const isActive = currentGroupId === groupId;
          const avatarStyle = {
            background: getGroupGradient(group)
          };

          return (
            <button
              key={groupId}
              type="button"
              className={`group-card ${isActive ? "active" : ""}`}
              onClick={() => onSelectGroup(group)}
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <span className="group-avatar" style={avatarStyle}>
                {getGroupInitials(groupName)}
              </span>
              <span className="group-meta">
                <strong>{groupName}</strong>
                <small>{groupId}</small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default GroupsList;
