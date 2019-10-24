package es.vass.formattion.angular.service.application;

import java.io.Serializable;
import java.util.Collections;
import java.util.Set;

import javax.ws.rs.*;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;

import com.liferay.portal.kernel.cache.MultiVMPoolUtil;
import com.liferay.portal.kernel.cache.PortalCache;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONException;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.security.access.control.AccessControlled;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.jaxrs.whiteboard.JaxrsWhiteboardConstants;

/**
 * @author michalsobocinski
 */
@Component(
	property = {
		JaxrsWhiteboardConstants.JAX_RS_APPLICATION_BASE + "=/todo-rest-service",
		JaxrsWhiteboardConstants.JAX_RS_NAME + "=Todo.Rest",
		"oauth2.scopechecker.type=none",
		"auth.verifier.guest.allowed=true"
	},
	service = Application.class
)
public class TodoRestServiceApplication extends Application {
	private static final Log _log = LogFactoryUtil.getLog(TodoRestServiceApplication.class);

	private static final String CACHE_NAME = TodoRestServiceApplication.class.getName();
	private static final String CACHE_TODO_LIST_KEY = TodoRestServiceApplication.class.getName();
	private static final int CACHE_TIME_TO_LIVE = 36000;

	public Set<Object> getSingletons() {
		return Collections.<Object>singleton(this);
	}

	@GET
	@Path("/get-todo-list")
	@AccessControlled(guestAccessEnabled = true)
	@Produces(MediaType.APPLICATION_JSON)
	public String getTodoList() {
		JSONArray todoList = JSONFactoryUtil.createJSONArray();
		Serializable todoListFromCache = getFromCache(CACHE_NAME, CACHE_TODO_LIST_KEY);

		try {
			if (todoListFromCache != null && todoListFromCache.toString() != null) {
				todoList = JSONFactoryUtil.createJSONArray(todoListFromCache.toString());
			} else {
				todoList = JSONFactoryUtil.createJSONArray();

				todoList.put(createTask(1, "Task 1", "pending"));
				todoList.put(createTask(2, "Task 2", "pending"));
				todoList.put(createTask(3, "Task 3", "pending"));
				todoList.put(createTask(4, "Task 4", "pending"));
				todoList.put(createTask(5, "Task 5", "pending"));
				todoList.put(createTask(6, "Task 6", "pending"));
				todoList.put(createTask(7, "Task 7", "approved"));
				todoList.put(createTask(8, "Task 8", "rejected"));
				todoList.put(createTask(9, "Task 9", "pending"));
				todoList.put(createTask(10, "Task 10", "pending"));

				addToCache(CACHE_NAME, CACHE_TODO_LIST_KEY, todoList, CACHE_TIME_TO_LIVE);
			}
		} catch (Exception e) {
			_log.error(e.getMessage(), e);
		}

		return todoList.toJSONString();
	}

	@GET
	@Path("/get-task/{id}")
	@AccessControlled(guestAccessEnabled = true)
	@Produces(MediaType.APPLICATION_JSON)
	public String getTask(@PathParam("id") long taskId) {
		JSONObject task = JSONFactoryUtil.createJSONObject();
		JSONArray todoList = JSONFactoryUtil.createJSONArray();

		Serializable todoListFromCache = getFromCache(CACHE_NAME, CACHE_TODO_LIST_KEY);

		try {
			if (todoListFromCache != null && todoListFromCache.toString() != null) {
				todoList = JSONFactoryUtil.createJSONArray(todoListFromCache.toString());
			} else {
				todoList = JSONFactoryUtil.createJSONArray();

				todoList.put(createTask(1, "Task 1", "pending"));
				todoList.put(createTask(2, "Task 2", "pending"));
				todoList.put(createTask(3, "Task 3", "pending"));
				todoList.put(createTask(4, "Task 4", "pending"));
				todoList.put(createTask(5, "Task 5", "pending"));
				todoList.put(createTask(6, "Task 6", "pending"));
				todoList.put(createTask(7, "Task 7", "approved"));
				todoList.put(createTask(8, "Task 8", "rejected"));
				todoList.put(createTask(9, "Task 9", "pending"));
				todoList.put(createTask(10, "Task 10", "pending"));

				addToCache(CACHE_NAME, CACHE_TODO_LIST_KEY, todoList, CACHE_TIME_TO_LIVE);
			}

			if (todoList != null && todoList.length() > 0) {
				for (int i = 0; i < todoList.length(); i++) {
					if (todoList.getJSONObject(i).getInt("id") == taskId) {
						task = todoList.getJSONObject(i);
						break;
					}
				};
			}
		} catch (Exception e) {
			_log.error(e.getMessage(), e);
		}

		return task.toJSONString();
	}

	@POST
	@Path("/update-task")
	@AccessControlled(guestAccessEnabled = true)
	@Produces(MediaType.APPLICATION_JSON)
	public String updateTask(@FormParam("id") long taskId, @FormParam("description") String taskDescription, @FormParam("status") String taskStatus) {
		boolean success = false;

		try {
			JSONArray oldTodoList = JSONFactoryUtil.createJSONArray(getFromCache(CACHE_NAME, CACHE_TODO_LIST_KEY).toString());
			JSONArray newTodoList = JSONFactoryUtil.createJSONArray();

			for (int i = 0; i < oldTodoList.length(); i++) {
				JSONObject task = oldTodoList.getJSONObject(i);
				if (task.getInt("id") != taskId) newTodoList.put(task);
				else {
					task.put("description", taskDescription);
					task.put("status", taskStatus);

					newTodoList.put(task);

					removeFromCache(CACHE_NAME, CACHE_TODO_LIST_KEY);
					addToCache(CACHE_NAME, CACHE_TODO_LIST_KEY, newTodoList, CACHE_TIME_TO_LIVE);

					success = true;
				}
			}
		} catch (Exception e) {
			_log.error(e.getMessage(), e);
		}

		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();
		jsonObject.put("success", success);

		return jsonObject.toString();
	}

	private JSONObject createTask(int id, String description, String status) {
		JSONObject task = JSONFactoryUtil.createJSONObject();

		task.put("id", id);
		task.put("description", description);
		task.put("status", status);

		return task;
	}

	public void addToCache(String cacheName, Serializable key, Serializable value, int ttl) {
		_log.debug("Liferay Cache: Adding to cache. CacheName = " + cacheName + ", Key = " + key + ", TTL : " + ttl);
		PortalCache<Serializable, Serializable> cache = MultiVMPoolUtil.getPortalCache(cacheName);
		cache.put(key, value, ttl);
	}

	public Serializable getFromCache(String cacheName, Serializable key) {
		_log.debug("Liferay Cache: Fetching from cache. CacheName = " + cacheName + ", Key = " + key);

		PortalCache<Serializable, Serializable> cache = MultiVMPoolUtil.getPortalCache(cacheName);
		return cache.get(key);
	}

	public void removeFromCache(String cacheName, Serializable key) throws PortalException {
		_log.debug("Liferay Cache: Removing from cache. CacheName = " + cacheName + ", Key = " + key);
		PortalCache<Serializable, Serializable> cache = MultiVMPoolUtil.getPortalCache(cacheName);
		cache.remove(key);

	}

	public void clearCache(String cacheName) throws PortalException {
		_log.debug("Liferay Cache: Clearing cache. CacheName = " + cacheName);
		PortalCache<Serializable, Serializable> cache = MultiVMPoolUtil.getPortalCache(cacheName);
		cache.removeAll();
	}

	public void closeCachePool() {
		MultiVMPoolUtil.clear();
	}
}
