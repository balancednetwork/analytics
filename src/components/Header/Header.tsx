import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import logo from '../../assets/logo.svg?react';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
`;

const StyledLogo = styled(logo)`
  height: 32px;
  width: auto;
  path {
    fill: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
  transition: color ${({ theme }) => theme.transitions.fast};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const Header = () => {
  return (
    <StyledHeader>
      <Logo to="/">
        <StyledLogo />
      </Logo>
      
      <Nav>
        <NavLink to="/how-to">How-to</NavLink>
        <NavLink to="/demo">Demo</NavLink>
        <NavLink to="/stats" $isActive>Stats</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/forum">Forum</NavLink>
      </Nav>
    </StyledHeader>
  );
}; 