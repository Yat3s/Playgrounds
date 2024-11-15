import React, { useState, useEffect } from "react";
import { User } from "@prisma/client";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { message } from "antd";

interface UserEditorProps {
  user: User | undefined;
  onSetShowEditor: (showEditor: boolean) => void;
  onUserUpdated: (v: any) => void;
  onUserCreated: (v: any) => void;
  onRefetchUsers: () => void;
}

const UserEditor = ({
  user,
  onSetShowEditor,
  onUserUpdated,
  onUserCreated,
  onRefetchUsers,
}: UserEditorProps) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [image, setImage] = useState(user?.image || "");
  const [credits, setCredits] = useState(user?.credits.toString() || "100");
  const [role, setRole] = useState(user?.role.toString() || "0");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setImage(user.image || "");
      setCredits(user.credits.toString());
      setRole(user.role.toString());
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const userData = {
      name,
      email,
      phoneNumber,
      image,
      credits: parseFloat(credits),
      role: parseInt(role, 10),
    };

    if (user) {
      await onUserUpdated({ ...userData, userId: user.id });
      message.success("用户信息更新成功");
    } else {
      await onUserCreated(userData);
      message.success("用户创建成功");
    }

    onRefetchUsers();
    onSetShowEditor(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name">姓名:</label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">邮箱:</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="phoneNumber">电话号码:</label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="image">图片链接:</label>
        <Input
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="credits">积分:</label>
        <Input
          id="credits"
          type="number"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="role">角色:</label>
        <Input
          id="role"
          type="number"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onSetShowEditor(false)}
          className="w-fit border bg-white text-black hover:bg-white/90"
        >
          返回
        </Button>
        <Button className="w-fit" type="submit">
          提交
        </Button>
      </div>
    </form>
  );
};

export default UserEditor;
